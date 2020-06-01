class Calculation {
  _active = null;
  _tv = null; //tidal volumen
  _fio2 = null; // Oxygen content
  _rpm = null; // cycles min
  _ratio = null; // Breath Ratio
  _mv = null; //minute volume

  setActive(active) {
    this._active = active;

    this._setTdalVolume()
      ._setRpm()
      ._setMinuteVolume()
      ._setOxygenContent()
      ._setRatio();
    return active;
  }

  _setTdalVolume() {
    this._tv =
      (this._active.c_o2t * this._active.c_flo2 +
        this._active.c_airt * this._active.c_flair) *
      0.001;
    return this;
  }

  _setMinuteVolume() {
    this._mv = this._tv * this._rpm;
    return this;
  }

  _setRpm() {
    this._rpm = 60000 / this._active.c_cyclt;
    return this;
  }

  _setOxygenContent() {
    this._fio2 =
      (this._active.c_o2t * this._active.c_flo2 +
        this._active.c_airt * this._active.c_flair * 0.2) /
      this._tv /
      1000;
    return this;
  }

  _setRatio() {
    this._ratio = this._active.c_inspt / this._active.c_cyclt;
    return this;
  }

  getValue(data) {
    let param;
    if (typeof data === 'string') {
      param = data;
    } else {
      param = data.data;
    }

    if (this._active[param]) {
      return this._active[param];
    }

    switch (param) {
      case 'mv':
        return Math.round(this._mv);
      case 'rpm':
        return Math.round(this._rpm);
      case 'ratio':
        return Math.round(this._ratio * 100);
      case 'tv':
        return Math.round(this._tv);
      case 'fio2':
        return Math.round(this._fio2 * 100);
      default:
        return '';
    }
  }
}

export default Calculation;
