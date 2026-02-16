import fs from 'fs';
import { sep } from 'path';
import madge from 'madge';
import watch from 'node-watch';
import isConnected from '../../modules/check-connection.js';
import { blacklist, dev, source, to } from '../../modules/config.js';
import createDir from '../../modules/create-dir.js';
import deleteDS_Store from '../../modules/deleteDS_Store.js';
import empty from '../../modules/empty.js';
import FTP from '../../modules/ftp.js';
import no_process from '../../modules/process-files/no-process.js';
import postProcess from '../../modules/process-files/post-process-replace.js';
import processHTACCESS from '../../modules/process-files/process-htaccess.js';
import processHTML from '../../modules/process-files/process-html.js';
import processJS from '../../modules/process-files/process-js.js';
import processPHP from '../../modules/process-files/process-php-phtml.js';
import processCSS from '../../modules/process-files/process-scss.js';
import Schedule from '../../modules/schedule.js';
import serverOSNormalize from '../../modules/server-os-normalize.js';
import SFTP from '../../modules/sftp.js';
import { draft, sh, type } from '../../modules/sh.js';
import vReg from '../../modules/vReg.js';

export default async () => {
  const loading = {
    ftp: new draft('', `circle`, false),
  };

  const verifyClients = {
    ftp: dev?.ftp && !empty(dev?.ftp?.host) && !empty(dev?.ftp?.root),
    sftp: dev?.sftp && !empty(dev?.sftp?.host) && !empty(dev?.sftp?.root),
  };

  const ambiguousProtocols = verifyClients.ftp && verifyClients.sftp;
  const protocolType =
    ambiguousProtocols || (!verifyClients.ftp && !verifyClients.sftp)
      ? 'FTP or SFTP'
      : verifyClients.ftp
        ? 'FTP'
        : 'SFTP';
  const Protocol =
    ambiguousProtocols || protocolType === 'FTP or SFTP'
      ? false
      : verifyClients.ftp
        ? FTP
        : SFTP;

  console.log();

  loading.ftp.start();
  loading.ftp.string = `${sh.bold}${protocolType}:${sh.reset} ${sh.dim}Connecting`;

  const conn =
    !ambiguousProtocols && protocolType !== 'FTP or SFTP'
      ? await Protocol.connect(protocolType === 'FTP' ? dev.ftp : dev.sftp)
      : false;
  if (!conn) {
    Protocol?.client?.close && Protocol.client.close();
    loading.ftp.stop(
      3,
      `${sh.dim}${sh.bold}${protocolType}:${sh.reset}${sh.dim} ${
        ambiguousProtocols
          ? 'Only one protocol is accept, choose between one of them'
          : 'No connected'
      }`
    );
  } else
    loading.ftp.stop(
      1,
      `${sh.bold}${protocolType}:${sh.reset} ${sh.dim}Connected`
    );

  const deploy = new Schedule();
  const watcherSource = watch(source, { recursive: true });
  const watcherMain = watch(to, { recursive: true });
  const watcherRoot = watch('./', { recursive: true });

  const onSrc = async (event, file) => {
    if (!!file.match(/DS_Store/)) {
      await deleteDS_Store();
      return;
    }

    if (file === `${source}${sep}exit`) {
      Protocol?.client?.close && Protocol.client.close();
      watcherSource.close();
      watcherMain.close();
      process.exit(0);
    }

    const inBlacklist = blacklist.some(
      (item) => !!file.match(vReg(item, 'gi'))
    );
    if (inBlacklist) {
      console.log(
        `${sh.blue}ℹ${sh.reset} Ignoring file in blacklist: "${sh.bold}${file}${sh.reset}"`
      );
      return;
    }

    const isDir = file.split(sep).pop().includes('.') ? false : true;
    if (event == 'update' && isDir) return;

    /* Verificar se o item já está em processamento */
    if (!deploy.scheduling?.file) deploy.scheduling.file = file;
    else if (deploy.scheduling.file === file) return;

    const log = { building: new draft('', `dots`, false) };

    const fileType = file.split('.').pop().toLowerCase();
    const finalFile = file.replace(source, to);

    let pathFile = file.split(sep);
    pathFile.pop();
    pathFile = pathFile.join(sep);

    if (event === 'update') {
      log.building.start();
      log.building.string = `Building ${sh.dim}from${sh.reset} "${
        sh.bold
      }${type(file)}${file}${sh.reset}"`;

      let status = 1;

      /* pre processed files */
      if (fileType === 'js' || fileType === 'ts') {
        const request = await processJS(file);

        if (!request) status = 0;
      } else if (fileType === 'scss' || fileType === 'css') {
        const request = await processCSS(file);

        if (!request) status = 0;
      } else {
        /* post process */
        const original = await postProcess({
          src: file,
          response: true,
          to: finalFile,
        });
        let minified = false;

        if (original !== 'skip-this-file') {
          /* specials */
          if (!no_process(file)) {
            if (fileType === 'php' || fileType === 'phtml')
              minified = await processPHP(original);
            else if (fileType === 'html')
              minified = await processHTML(original, file);
            else if (fileType === 'htaccess')
              minified = await processHTACCESS(original);
          }

          if (minified !== 'skip-this-file') {
            createDir(pathFile.replace(source, to));
            fs.writeFileSync(finalFile, !minified ? original : minified);
          }
        }
      }

      log.building.stop(status);
    } else if (event === 'remove') {
      log.building.start();
      log.building.string = `Removed ${sh.dim}from${sh.reset} "${sh.bold}${type(
        file
      )}${file}${sh.reset}"`;

      if (isDir) fs.rmSync(finalFile, { recursive: true, force: true });
      else {
        if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
        if (fileType === 'scss') {
          if (fs.existsSync(finalFile.replace('.scss', '.css')))
            fs.unlinkSync(finalFile.replace('.scss', '.css'));
        }
      }

      log.building.stop(1);
    }
  };

  watcherSource.on('change', (event, file) => onSrc(event, file));

  watcherRoot.on('change', (event, file) => {
    if (event !== 'update') return;

    const alreadyChecked = [];

    const searchImports = async (module) => {
      const filteredModule = module
        .replace(/\.\.\//g, '')
        .replace(/\//g, '\\/');

      if (
        new RegExp(`^(${source}|${to}|node_modules|temp_)`).test(filteredModule)
      )
        return;

      const { tree: dependencies } = await madge(source, {
        extensions: ['js', 'ts'],
        fileExtensions: ['js', 'ts'],
        excludeRegExp: ['node_modules'],
      });

      const filteredDependencies = Object.fromEntries(
        Object.entries(dependencies).filter(
          ([key]) => !new RegExp(filteredModule).test(key)
        )
      );

      for (const [resource, dependecy] of Object.entries(
        filteredDependencies
      )) {
        const hasThisModule = dependecy.some((key) =>
          new RegExp(`^${filteredModule}`).test(key.replace(/\.\.\//g, ''))
        );

        if (!hasThisModule) continue;
        else {
          if (/\.\//.test(resource)) {
            searchImports(resource);
          } else {
            const finalSource = `${source}/${resource}`;

            if (alreadyChecked.includes(finalSource)) continue;
            else {
              alreadyChecked.push(finalSource);
              onSrc(event, finalSource);
            }
          }
        }
      }
    };

    searchImports(file);
  });

  watcherMain.on('change', async (event, file) => {
    if (!!file.match(/DS_Store/)) {
      await deleteDS_Store();
      return;
    }

    const connected = await isConnected();

    async function deployFile() {
      const log = { status: new draft('', `dots`, false) };
      if (connected && conn) log.deploy = new draft('', `dots`, false);

      log.status.start();
      log?.deploy && log.deploy.start();

      /* shows file or directory that is in attendance */
      if (event == 'update') {
        log.status.stop(
          1,
          `Copied ${sh.dim}to${sh.reset} "${type(deploy.scheduling.current)}${
            sh.bold
          }${deploy.scheduling.current}${sh.reset}"`
        );
        if (connected && conn)
          log.deploy.string = `Deploying ${sh.dim}to${sh.reset} "${type(
            deploy.scheduling.current
          )}${sh.bold}${serverOSNormalize(
            deploy.scheduling.current.replace(
              to,
              Protocol.publicCachedAccess.root
            )
          )}${sh.reset}"`;
      } else {
        log.status.stop(
          1,
          `Removed ${sh.dim}from${sh.reset} "${type(
            deploy.scheduling.current
          )}${sh.bold}${deploy.scheduling.current}${sh.reset}"`
        );
        if (connected && conn)
          log.deploy.string = `Removing ${sh.dim}from${sh.reset} "${type(
            deploy.scheduling.current
          )}${sh.bold}${serverOSNormalize(
            deploy.scheduling.current.replace(
              to,
              Protocol.publicCachedAccess.root
            )
          )}${sh.reset}"`;
      }

      if (connected && conn) {
        const action =
          event == 'update'
            ? await Protocol.send(file, deploy)
            : await Protocol.remove(file, isDir);

        log.deploy.stop(!!action ? 1 : 0, Protocol.client.error);
      }
    }

    const isDir = file.split(sep).pop().includes('.') ? false : true;
    if (event == 'update' && isDir) return;

    deploy.queue(deployFile, file);
    await deploy.start();
  });

  return true;
};
