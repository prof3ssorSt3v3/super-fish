//utility classes
class NavEvent extends CustomEvent {
  constructor(props) {
    super('navevent', { detail: { ...props } });
    // ev.detail.whatever
  }
}

class FetchError extends Error {
  constructor(msg, _req, _res) {
    super(msg);
    this.name = 'FetchError';
    this.req = _req;
    this.res = _res;
    this.status = _res.status;
  }
}

export { FetchError, NavEvent };
