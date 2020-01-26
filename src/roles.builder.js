const roleUpgrader = require('./roles.upgrader');

module.exports = {
  run: (creep) => {
    if (creep.memory.target && creep.room.name !== creep.memory.target) {
      const exit = creep.room.findExitTo(creep.memory.target);
      creep.moveTo(creep.pos.findClosestByRange(exit));
      return;
    }

    if (creep.memory.working === true && creep.carry.energy === 0) {
      creep.memory.working = false;
    } else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working === true) {
      const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (constructionSite) {
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSite);
        }
      } else {
        roleUpgrader.run(creep);
      }
    } else {
      const source = creep.pos.findClosestByPath(FIND_SOURCES);
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  },
};
