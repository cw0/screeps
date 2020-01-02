const harvesterRole = require('./roles.harvester');
const upgraderRole = require('./roles.upgrader');
const builderRole = require('./roles.builder');
const repairerRole = require('./roles.repairer');

const minimumNumberOfHarvesters = 10;
const minimumNumberOfUpgraders = 1;
const minimumNumberOfBuilders = 1;
const minimumNumberOfRepairers = 2;

const loop = () => {
  // clear memory
  Object.values(Memory.creeps).forEach(((name) => {
    if (Game.creeps[name] === undefined) {
      delete Memory.creeps[name];
    }
  }));

  Object.values(Game.creeps).forEach((creep) => {
    switch (creep.memory.role) {
      case 'harvester': {
        harvesterRole.run(creep);
        break;
      }
      case 'upgrader': {
        upgraderRole.run(creep);
        break;
      }
      case 'builder': {
        builderRole.run(creep);
        break;
      }
      case 'repairer': {
        repairerRole.run(creep);
        break;
      }
      default: {
        harvesterRole.run(creep);
        break;
      }
    }
  });

  const numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role === 'harvester');
  const numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role === 'upgrader');
  const numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role === 'builder');
  const numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role === 'repairer');

  let name;

  if (numberOfHarvesters < minimumNumberOfHarvesters) {
    name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, {
      role: 'harvester',
      working: false,
    });
  } else if (numberOfUpgraders < minimumNumberOfUpgraders) {
    name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, {
      role: 'upgrader',
      working: false,
    });
  } else if (numberOfRepairers < minimumNumberOfRepairers) {
    name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, {
      role: 'repairer',
      working: false,
    });
  } else if (numberOfBuilders < minimumNumberOfBuilders) {
    name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, {
      role: 'builder',
      working: false,
    });
  } else {
    name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, {
      role: 'builder',
      working: false,
    });
  }
  if (!(name < 0)) {
    console.log('Spawned new creep: ', name);
  }
};

module.exports = {
  loop,
};
