import Calculation from '../details/Calculation';

class Adjust extends Calculation {
  /**
   *
   * @param {number} mv
   */
  _validateMinuteVolume(mv) {
    const tv = mv / this._rpm;
    const c_inspt = this._active.c_cyclt * this._ratio;
    const c_airt =
      ((tv * (1 - this._fio2)) / (this._active.c_flair * 0.8)) * 1000;

    const c_o2t =
      (tv * 1000 * this._fio2 -
        0.2 * this._active.c_flair * this._active.c_airt) /
      this._active.c_flo2;

    if (c_airt + c_o2t > c_inspt) {
      const ratio = (c_airt + c_o2t) / this._active.c_cyclt;
      if (ratio > this._limits.rpm.max) {
        return {error: ['mv', 'rpm']};
      } else {
        this._active.c_inspt = c_airt + c_o2t;
        this._active.ratio = ratio;
        return {valid: ['mv', 'tv', 'rpm']};
      }
    }

    this._active.c_inspt = c_inspt;
    this._active.c_airt = c_airt;
    this._active.c_o2t = c_o2t;

    return {valid: ['tv', 'mv']};
  }

  /**
   *
   * @param {number} rpm
   */
  _validateRpm(rpm) {
    this._active.c_cyclt = 60000 / rpm;
    return {valid: ['rpm', 'tv']};
  }

  /**
   *
   * @param {number} oxy
   */
  _validateOxygenContent(oxy) {
    oxy = oxy / 100;

    this._active.c_airt =
      ((this._tv * (1.0 - oxy)) / (this._active.c_flair * 0.8)) * 1000;
    this._active.c_o2t =
      (this._tv * 1000 * oxy -
        0.2 * this._active.c_flair * this._active.c_airt) /
      this._active.c_flo2;

    return {valid: ['fio2']};
  }

  /**
   *
   * @param {number} ratio
   */
  _validateRatio(ratio) {
    ratio = ratio / 100;

    const c_inspt = this._active.c_cyclt * ratio;
    if (c_inspt < this._active.c_airt + this._active.c_o2t) {
      return {error: ['rpm', 'ratio']};
    }

    this._active.c_inspt = c_inspt;
    return {valid: ['ratio']};
  }

  _validateC_lip(value) {
    if (value >= this._active.c_pip) {
      return {error: ['c_lip']};
    }

    this._active.c_lip = value;
    return {valid: ['c_lip']};
  }

  _validateC_pip(value) {
    if (value <= this._active.c_lip) {
      return {error: ['c_pip']};
    }

    this._active.c_pip = value;
    return {valid: ['c_pip']};
  }

  _validateC_lep(value) {
    if (value >= this._active.c_pep) {
      return {error: ['c_lep']};
    }

    this._active.c_lep = value;
    return {valid: ['c_lep']};
  }

  _validateC_pep(value) {
    if (value <= this._active.c_lep) {
      return {error: ['c_pep']};
    }

    this._active.c_pep = value;
    return {valid: ['c_pep']};
  }

  validate(key, value) {
    switch (key) {
      case 'mv':
        return this._validateMinuteVolume(value);
      case 'rpm':
        return this._validateRpm(value);
      case 'fio2':
        return this._validateOxygenContent(value);
      case 'ratio':
        return this._validateRatio(value);
      case 'c_lip':
        return this._validateC_lip(value);
      case 'c_pip':
        return this._validateC_pip(value);
      case 'c_lep':
        return this._validateC_lep(value);
      case 'c_pep':
        return this._validateC_pep(value);
      default:
        return '';
    }
  }
}

export default Adjust;
