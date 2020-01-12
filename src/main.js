require('./prototype.spawn')();
const harvesterRole = require('./roles.harvester');
const upgraderRole = require('./roles.upgrader');
const builderRole = require('./roles.builder');
const repairerRole = require('./roles.repairer');
const wallRepairerRole = require('./roles.wallRepairer');
const longDistanceHarvesterRole = require('./roles.longDistanceHarvester');

const minimumNumberOfHarvesters = 2;
const minimumNumberOfUpgraders = 2;
const minimumNumberOfBuilders = 1;
const minimumNumberOfRepairers = 1;
const minimumNumberOfWallRepairers = 1;
const minimumNumberOfLongDistanceHarvestersNorth = 1;
const minimumNumberOfLongDistanceHarvestersEast = 1;
const home = 'E46S9';

const loop = () => {
  // clear memory
  Object.values(Memory.creeps).forEach(((name) => {
    if (!Game.creeps[name]) {
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
      case 'wallRepairer': {
        wallRepairerRole.run(creep);
        break;
      }
      case 'longDistanceHarvester': {
        longDistanceHarvesterRole.run(creep);
        break;
      }
      default: {
        harvesterRole.run(creep);
        break;
      }
    }
  });

  // Tower Controls
  const towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
    filter: (s) => s.structureType === STRUCTURE_TOWER,
  });
  if (towers) {
    towers.forEach((tower) => {
      const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (target) {
        tower.attack(target);
      }
    });
  }

  const numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role === 'harvester');
  const numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role === 'upgrader');
  const numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role === 'builder');
  const numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role === 'repairer');
  const numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role === 'wallRepairer');
  const numberOfLongDistanceHarvestersNorth = _.sum(Game.creeps, (c) => c.memory.role === 'longDistanceHarvester'
                                                                        && c.memory.target === 'E46S8');
  const numberOfLongDistanceHarvestersEast = _.sum(Game.creeps, (c) => c.memory.role === 'longDistanceHarvester'
                                                                       && c.memory.target === 'E47S9');

  const energy = Math.floor(Game.spawns.Spawn1.room.energyCapacityAvailable / 2);

  let name;

  if (numberOfHarvesters < minimumNumberOfHarvesters) {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');
    if (name === ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters === 0) {
      name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'harvester');
    }
  } else if (numberOfUpgraders < minimumNumberOfUpgraders) {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
  } else if (numberOfRepairers < minimumNumberOfRepairers) {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
  } else if (numberOfBuilders < minimumNumberOfBuilders) {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
  } else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer');
  } else if (numberOfLongDistanceHarvestersEast < minimumNumberOfLongDistanceHarvestersEast) {
    name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 5, home, 'E47S9', 0);
  } else if (numberOfLongDistanceHarvestersNorth < minimumNumberOfLongDistanceHarvestersNorth) {
    name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 5, home, 'E46S8', 0);
  } else {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
  }

  if (!(name < 0)) {
    console.log(`Spawned new ${Game.creeps[name].memory.role} creep: ${name}`);
  }
};

module.exports = {
  loop,
};
