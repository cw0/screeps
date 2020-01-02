const harvesterRole = require('./roles.harvester');
const upgraderRole = require('./roles.upgrader');

const minimumNumberOfHarvesters = 10;

const loop = () => {
  // clear memory
  Object.values(Memory.creeps).forEach(((name) => {
    if (Game.creeps[name] === undefined) {
      delete Memory.creeps[name];
    }
  }));

  Object.values(Game.creeps).forEach((creep) => {
    if (creep.memory.role === 'harvester') {
      harvesterRole.run(creep);
    } else if (creep.memory.role === 'upgrader') {
      upgraderRole.run(creep);
    }
  });

  const numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role === 'harvester');

  if (numberOfHarvesters < minimumNumberOfHarvesters) {
    const name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, {
      role: 'harvester',
      working: false,
    });

    if (!(name < 0)) {
      console.log('Spawned new creep: ', name);
    }
  } else {
    const name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, {
      role: 'upgrader',
      working: false,
    });

    if (!(name < 0)) {
      console.log('Spawned new creep: ', name);
    }
  }
};

module.exports = {
  loop,
};
