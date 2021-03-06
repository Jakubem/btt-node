const Util = require('./util');
const Widget = require('./widget');
const Trigger = require('./trigger');

/**
 * Class used to manage the BTT webserver 
 */
class BTT {
  /**
   * Constructor for BetterTouchTool webserver related actions
   * @param {*} config 
   */
  constructor(config) {
    const { domain, port, protocol } = config;
    
    if (!domain || !port || !protocol) {
      throw new Error('Missing config');
    }

    this.domain = domain;
    this.port = port;
    this.protocol = protocol;
  }

  /**
   * Returns a base url for the BTT webserver endpoint
   */
  get url() {
    return `${this.protocol}://${this.domain}:${this.port}/`;
  }

  /**
   * Makes an action of BTT server with given params
   * @param {*} action 
   * @param {*} data 
   */
  do(action, data) {
    const url = `${this.url}${action}/?${this.params(data)}`;
    return Util.fetch(url);
  }

  /**
   * Parses given list of params (key-value object) and converts it 
   * to query parameters
   * @param {*} data 
   */
  params(data) {
    return Object.keys(data).map(param => {
      return `${param}=${Util.escapeForBtt(data[param])}`;
    }).join('&');
  }

  /**
   * Exposes btt widget constructor, passing current BTT instance as dependency
   * @param {*} config 
   */
  Widget(config) {
    const widget = new Widget(config, this);

    return widget;
  }

  /**
   * Exposes btt trigger constructor, passing current BTT instance as dependency
   * @param {*} config 
   */
  Trigger(config) {
    const trigger = new Trigger(config, this);

    return trigger;
  }

  /**
   * Returns various utility function for managing triggers
   */
  get Trigger() {
    return {
      /**
       * Creates a new trigger with given data
       */
      new: (data) => {
        this.do('add_new_trigger', {
          json: JSON.stringify(data),
        });
      }
    }
  }
}

module.exports = BTT;
