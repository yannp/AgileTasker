window.Pile = Backbone.Collection.extend({
  model: Task,

  nextOrder: function() {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
  },

  comparator: function(task) {
    return task.get('order');
  }
});