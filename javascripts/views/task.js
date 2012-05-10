window.TaskView = Backbone.View.extend({

  tagName:  "li",

  template: _.template($('#item-template').html()),

  events: {
    "click .check"              : "toggleDone",
    "dblclick div.todo-content" : "edit",
    "click span.todo-destroy"   : "clear",
    "keypress .todo-input"      : "updateOnEnter"
  },

  initialize: function() {
    _.bindAll(this, 'render', 'close');
    this.model.bind('change', this.render);
    this.model.view = this;
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    this.setContent();
    return this;
  },

  setContent: function() {
    var content = this.model.get('content');
    this.$('.todo-content').text(content);
    this.input = this.$('.todo-input');
    this.input.bind('blur', this.close);
    this.input.val(content);
  },

  toggleDone: function() {
    this.model.toggle();
  },

  edit: function() {
    $(this.el).addClass("editing");
    this.input.focus();
  },

  close: function() {
    this.model.save({content: this.input.val()});
    $(this.el).removeClass("editing");
  },

  updateOnEnter: function(e) {
    if (e.keyCode == 13) this.close();
  },

  remove: function() {
    $(this.el).remove();
  },

  clear: function() {
    this.model.clear();
  }

});
