const handleCreep = (creep) => {
  if (creep.memory.working === true && creep.carry.energy === 0) {
    creep.memory.working = false;
  } else if (creep.memory.working === false && creep.carry.energy === creep.carry.carryCapacity) {
    creep.memory.working = true;
  }

  if (creep.memory.working === true) {
    //TODO find closest spawn
    if (creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns.Spawn1);
    }
  } else {
    const source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }
};

const loop = () => {
  // console.log('test');
  Object.values(Game.creeps).forEach((creep) => {
    handleCreep(creep);
  });
};


module.exports = {
  loop,
};
