import Instance from "./instance";

export default class TypeIt {
  constructor(element, args) {
    this.id = this.generateHash();
    this.instances = [];
    this.elements = [];
    this.args = args;

    if (typeof element === "object") {
      //-- There's only one!
      if (element.length === undefined) {
        this.elements.push(element);
      } else {
        //-- It's already an array!
        this.elements = element;
      }
    }

    //-- Convert to array of elements.
    if (typeof element === "string") {
      this.elements = document.querySelectorAll(element);
    }

    this.createInstances();
  }

  generateHash() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }

  createInstances() {
    [].slice.call(this.elements).forEach(element => {
      this.instances.push(new Instance(element, this.id, this.args));
    });
  }

  pushAction(func, argument = null) {
    this.instances.forEach(instance => {
      instance.queue.push([instance[func], argument]);
    });
  }

  /**
   * If used after typing has started, will append strings to the end of the existing queue. If used when typing is paused, will restart it.
   *
   * @param  {string} string The string to be typed.
   * @return {object} TypeIt instance
   */
  type(string = '') {
    this.instances.forEach((instance) => {

      //-- Queue up a string right off the bat.
      instance.queueUpString(string);

      //-- if currently paused, restart the queue.
      if(instance.isPaused === true) {
        instance.isPaused = false;
        instance.next();
        return;
      }

      if(instance.isComplete === true) {
        console.log('nexting...');
        instance.next();
      }
    });

    return this;
  }

  delete(numCharacters = null) {
    this.instances.forEach(instance => {
      instance.queue.push([instance.delete, numCharacters]);
    });

    return this;
  }

  /**
   * If typing has already started, pause it. Otherwise, just insert a pause action
   *
   * @param  {number} ms Number of milliseconds to pause
   * @return {object} TypeIt instance
   */
  pause(ms = null) {
    this.instances.forEach((instance) => {

      if(instance.hasStarted === true) {

        if(ms === null) {
          instance.isPaused = true;
          return;
        }

        //-- Insert a pause at the beginning of the queue.
        instance.queue.unshift([instance.pause, ms]);
        return;
      }

      instance.queue.push([instance.pause, ms]);
    });

    return this;
  }

  destroy(removeCursor = true) {
    this.instances.forEach(instance => {
      instance.timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });

      if (removeCursor) {
        instance.element.removeChild(
          instance.element.querySelector(".ti-cursor")
        );
      }
    });

    this.instances = [];
  }

  empty() {
    this.pushAction("empty");
    return this;
  }

  break() {
    this.pushAction("break");
    return this;
  }

  options(options) {
    this.pushAction("setOptions", options);
    return this;
  }
}
