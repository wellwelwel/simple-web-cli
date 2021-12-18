/* Schedules a async services queue */

class Schedule {

   constructor() {

      this.scheduling = {

         /* Attendance status */
         busy: false,
         /* Store queued services */
         queuing: [ ],
         started: false,
         /**
          * Service (function)
          * Name of current service in attendance (optional)
         **/
         current: '',
         exceed: [ ]
      };

      this.queue = function(callback, name = '') {

         const { queuing, exceed } = this.scheduling;

         /* Add to queue */
         if (this.scheduling.started === false) {

            queuing.push({

               name: name,
               service: callback
            });
         }
         else {

            exceed.push({

               name: name,
               service: callback
            });
         }
      };

      /* Starts attendance */
      this.start = async function(options) {

         const set_options = {

            type: options?.type || 'recursive',
            timeInterval: options?.timeInterval || 0,
            recursive: options?.recursive || true
         };

         this.scheduling.started = true;

         const { queuing, exceed } = this.scheduling;

         const recursive = async () => {

            const waiting = setInterval(async () => {

               for (const key in queuing) {

                  /* Wait if another service is already in attendance */
                  if (this.scheduling.busy === true) return;

                  /* Holds the queue */
                  this.scheduling.busy = true;
                  /* Calls the first service in the queue */
                  this.scheduling.current = queuing[key].name;

                  /* Where your magic happens */
                  await queuing[key].service();

                  /* Ends service in attendance */
                  queuing.splice(queuing[key], 1);
                  /* Release the queue */
                  this.scheduling.busy = false;
               }

               if (queuing.length === 0) {

                  if (exceed.length > 0) queuing.push(exceed.shift());
                  /* Ends attendance if the queue is empty */
                  else if (exceed.length === 0) {

                     this.scheduling.started = false;
                     clearInterval(waiting);

                     if (this.scheduling?.file) delete this.scheduling.file;
                     if (this.scheduling?.copying) delete this.scheduling.copying;
                  }
               }
            }, set_options.timeInterval);
         };

         const timeInterval = () => {

            let timer = 0;
            for (const key in queuing) setTimeout(async () => await queuing[key].service(), timer += set_options.timeInterval);
         };

         set_options.type === 'recursive' === true ? await recursive() : timeInterval();
      };
   };
}

module.exports = Schedule;