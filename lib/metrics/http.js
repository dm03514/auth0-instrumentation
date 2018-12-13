


class DebugRuntimeToggle {
  constructor(metricType, appmetrics) {
    this.metricType = metricType;
    this.appmetrics = appmetrics;
    this.enabled = false;
    this.toggle = this.toggle.bind(this);
  }

  toggle(req, res) {
    const action = (this.enabled) ? 'disable' : 'enable';
    this.appmetrics[action](this.metricType);
    res.send({
      action: action,
      metricType: this.metricType,
    });
    this.enabled = !this.enabled;
  }
}

module.exports = {
  DebugRuntimeToggle: DebugRuntimeToggle,
};
