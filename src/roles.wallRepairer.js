const builderRole = require('./roles.builder');

module.exports = {
  run: (creep) => {
    if (creep.memory.working === true && creep.carry.energy === 0) {
      creep.memory.working = false;
    } else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working === true) {
      const walls = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_WALL,
      });
      if (walls) {
        let target;
        // TODO gross
        for (let i = 0.01; i <= 1; i += 0.01) {
          for (let j = 0; j < walls.length; j += 1) {
            if (walls[j].hits / walls[j].hitsMax < i) {
              target = walls[j];
              break;
            }
          }

          if (target) {
            break;
          }
        }

        if (target) {
          if (creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          } else {
            builderRole.run(creep);
          }
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
