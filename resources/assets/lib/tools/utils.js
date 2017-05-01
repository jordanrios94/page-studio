(function(){
  var _, utils;
  _ = this._ || require('lodash');
  utils = {
    makeQueryString: function(params){
      return _.map(params || {}, function(value, key){
        return _.map([key, value], encodeURIComponent).join('=');
      }).join('&');
    },
    defaultConfig: {
      apiUrl: '/apibroker/',
      authApiUrl: '/authapi/isauthenticated',
      docApiUrl: '/docapi/',
      streamingEnabled: true
    }
  };
  if (this) {
    this.utils = utils;
  }
  if (typeof module != 'undefined' && module !== null) {
    module.exports = utils;
  }
}).call(this);
