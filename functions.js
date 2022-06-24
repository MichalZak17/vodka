module.exports = {
    hasRole: function (member, roles) {
        for (let role in roles) {
            if (member.roles.cache.find(r => r.id === roles[role])) { 
                return true; 
            }
        }
        return false;
    },

    random: function(arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }
}