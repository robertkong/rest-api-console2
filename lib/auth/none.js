var api_root = null;

function sendRequest(req, callback) {

  // TODO: format the request correctly before sending
  // check the version
  // clean up the path in case it's an absolute URI

  $.ajax({
    type: req.method,
    url: api_root + '/v1' + req.path + (req.query ? "?" + req.query : '' ),
    data: req.method == 'GET' ? null : req.body,
    success: function(data, status, xhr) {
      callback(null, data, xhr);
    },
    error: function(xhr, errorType, error) {
      var body = xhr.response;

      try {
        body = JSON.parse(body);
      } catch (e) {
        // not valid json
      }
      callback({
        status: xhr.status,
        error: error,
        errorType: errorType,
        body: body,
      }, null, xhr);
    }
  });
}

function None(panel) {
	panel.node.hide();
}

None.prototype.request = sendRequest;

function buildNone(panel) {
  return new None(panel);
}

module.exports = function(config) {
  api_root = config.api_root;

  return buildNone;

};