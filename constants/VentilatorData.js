export const config = [
  {
    label: 'Minute volume',
    help: 'Tidal volume * breathing cycles',
    editable: true,
    data: 'mv',
    unit: 'ml',
    key: 'volume',
    step: 250,
  },
  {
    label: 'Tidal volume',
    help: 'Total volume of breathing air per stroke',
    editable: false,
    data: 'tv',
    unit: 'ml',
    key: 'tidal',
    step: 1000,
  },

  {
    label: 'Cycles / min',
    help: '',
    data: 'rpm',
    editable: true,
    unit: 'rpm',
    key: 'cycles',
    step: 1,
  },
  {
    label: 'Breathing ratio',
    help: null,
    data: 'ratio',
    editable: true,
    unit: '%',
    key: 'ratio',
    step: 1,
  },
  {
    label: 'Oxygen content',
    help: 'from mixture 20 ... 100%',
    editable: true,
    data: 'fio2',
    unit: '%',
    key: 'oxygen',
    step: 1,
  },
];

export const pressures = [
  {
    label: 'Min inspiration pressure alarm',
    help: 'Configured lowest inspiration pressure alarm limit',
    data: 'c_lip',
    unit: 'mbar',
    key: 'clip',
    step: 1,
    editable: true,
  },
  {
    label: 'Max inspiration pressure alarm',
    help: 'Configured max inspiration pressure alarm limit',
    data: 'c_pip',
    unit: 'mbar',
    key: 'cpip',
    step: 1,
    editable: true,
  },
  {
    label: 'Min exspiration pressure alarm',
    help: 'Configured lowest exspiration pressure alarm limit',
    data: 'c_lep',
    unit: 'mbar',
    key: 'clep',
    step: 1,
    editable: true,
  },
  {
    label: 'Max exspiration pressure alarm',
    help: 'Configured max exspiration pressure alarm limit',
    data: 'c_pep',
    unit: 'mbar',
    key: 'cpep',
    step: 1,
    editable: true,
  },
];

// nicht im edit mode
export const flows = [
  {
    label: 'Flow rate air',
    help: 'Configured flow rate air ml/sec',
    data: 'c_flair',
    unit: 'ml',
    key: 'cflair',
  },
  {
    label: 'Flow rate O2',
    help: 'Configured flow rate O2 ml/sec',
    data: 'c_flo2',
    unit: 'ml',
    key: 'cflo2',
  },
  {
    label: 'Air time',
    help:
      'Configured air time ms (approx 240ml) this makes the air part of tidal volume',
    data: 'c_airt',
    unit: 'ml',
    key: 'cairt',
  },
  {
    label: 'O2 time',
    help:
      'Configured o2 time ms (approx 240ml) this makes the oxygen part of tidal volume',
    data: 'c_o2t',
    unit: 'ml',
    key: 'co2t',
  },
  {
    label: 'Inspiration time',
    help:
      'Configured inspiration time in ms before releasing outflow valve block to PEEP',
    max: 5000,
    unit: 'ms',
    key: 'cinspt',
  },
];

// nicht configurierbar
export const other = [
  {
    label: 'Heater temp',
    help: 'Configured heater water temp',
    data: 'c_wtemp',
    unit: '°C',
    key: 'cwtemp',
  },
  {
    label: 'Water temp actual value',
    help: 'Actual heater water temp',
    data: 'a_wtemp',
    max: null,
    unit: '°C',
    key: 'awtemp',
  },
  {
    label: 'Exspiration press',
    help: 'Actual end exspiration press last cycle',
    data: 'a_eep',
    max: null,
    unit: 'mbar',
    key: 'aeep',
  },
];
