const loop = () => {
  console.log('test');
};

const handleCreep = (creep) => {
  if (creep.memory.working === true) {
    //TODO find closest spawn
    if (creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns.Spawn1);
    }
  }
  else {
    creep.pos.findClosestByPath(FIND_SOURCES);
  }
};

module.exports = {
  loop,
};
