const builderRole = require('./roles.builder');

module.exports = {
  run: (creep) => {
    if (creep.memory.working === true && creep.carry.energy === 0) {
      creep.memory.working = false;
    } else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working === true) {
      const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL,
      });

      if (structure) {
        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      } else {
        builderRole.run(creep);
      }
    } else {
      const source = creep.pos.findClosestByPath(FIND_SOURCES);
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  },
};
