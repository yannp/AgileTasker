window.Todo = Backbone.Model.extend({
  initialize: function() {
    
  },

  update: function() {
    sendToServer(request("delete", "task", this.uid));
    this.view.remove();
  },

  delete: function() {
    sendToServer(request("delete", "task", this.uid));
    this.view.remove();
  }
});
