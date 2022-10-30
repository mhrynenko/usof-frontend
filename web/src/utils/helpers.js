function getFullDate (_date) {
    const d = new Date(_date)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    // const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}

module.exports = {
    getFullDate, 
}