notice = "connected"

window.Project = Backbone.Collection.extend({
  model: Pile,

  nextOrder: function() {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
  },

  comparator: function(pile) {
    return pile.get('order');
  }
});