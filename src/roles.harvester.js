module.exports = {
  run: (creep) => {
    if (creep.memory.working === true && creep.carry.energy === 0) {
      creep.memory.working = false;
    } else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working === true) {
      const structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => {
          const isValidType = (
            s.structureType === STRUCTURE_SPAWN
            || s.structureType === STRUCTURE_EXTENSION
            || s.structureType === STRUCTURE_TOWER
          );
          return s.energy < s.energyCapacity && isValidType;
        },
      });

      if (structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      } // TODO fallback if something breaks?
    } else {
      const source = creep.pos.findClosestByPath(FIND_SOURCES);
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  },
};
