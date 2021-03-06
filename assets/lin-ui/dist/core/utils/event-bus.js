function EventBusClass() {
    this.msgQueues = {}
}
EventBusClass.prototype = {
    on: function (s, e) {
        Object.prototype.hasOwnProperty.call(this.msgQueues, s) ? "function" == typeof this.msgQueues[s] ? this.msgQueues[s] = [this.msgQueues[s], e] : this.msgQueues[s] = [...this.msgQueues[s], e] : this.msgQueues[s] = e
    },
    one: function (s, e) {
        this.msgQueues[s] = e
    },
    emit: function (s, e) {
        Object.prototype.hasOwnProperty.call(this.msgQueues, s) && ("function" == typeof this.msgQueues[s] ? this.msgQueues[s](e) : this.msgQueues[s].map(s => {
            s(e)
        }))
    },
    off: function (s) {
        Object.prototype.hasOwnProperty.call(this.msgQueues, s) && delete this.msgQueues[s]
    }
};
const EventBus = new EventBusClass;
export default EventBus;