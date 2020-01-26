require('./prototype.spawn')();
const harvesterRole = require('./roles.harvester');
const upgraderRole = require('./roles.upgrader');
const builderRole = require('./roles.builder');
const repairerRole = require('./roles.repairer');
const wallRepairerRole = require('./roles.wallRepairer');
const longDistanceHarvesterRole = require('./roles.longDistanceHarvester');
const claimerRole = require('./roles.claimer');

// TODO fix long distance harvesters;
// const minimumNumberOfLongDistanceHarvestersNorth = 1;
// const minimumNumberOfLongDistanceHarvestersEast = 1;
// const home = 'E46S9';

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
      case 'claimer': {
        claimerRole.run(creep);
        break;
      }
      default: {
        harvesterRole.run(creep);
        break;
      }
    }
  });

  Object.values(Game.spawns).forEach((spawn) => {
    // Configure spawn
    if (!spawn.memory.config) {
      spawn.configureSpawn({
        minimumNumberOfHarvesters: 2,
        minimumNumberOfUpgraders: 2,
        minimumNumberOfBuilders: 1,
        minimumNumberOfRepairers: 1,
        minimumNumberOfWallRepairers: 1,
      });
    }
    // Tower Controls
    const towers = spawn.room.find(FIND_STRUCTURES, {
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

    // Get Creep numbers
    const creeps = spawn.room.find(FIND_MY_CREEPS);

    const numberOfHarvesters = _.sum(creeps, (c) => c.memory.role === 'harvester');
    const numberOfUpgraders = _.sum(creeps, (c) => c.memory.role === 'upgrader');
    const numberOfBuilders = _.sum(creeps, (c) => c.memory.role === 'builder');
    const numberOfRepairers = _.sum(creeps, (c) => c.memory.role === 'repairer');
    const numberOfWallRepairers = _.sum(creeps, (c) => c.memory.role === 'wallRepairer');

    // TODO fix long distance harvesters for multiple spawns
    // const numberOfLongDistanceHarvestersNorth = _.sum(Game.creeps, (c) => c.memory.role === 'longDistanceHarvester'
    //                                                                       && c.memory.target === 'E46S8');
    // const numberOfLongDistanceHarvestersEast = _.sum(Game.creeps, (c) => c.memory.role === 'longDistanceHarvester'
    //                                                                      && c.memory.target === 'E47S9');

    const energy = Math.floor(spawn.room.energyCapacityAvailable);

    let name;

    const {
      minimumNumberOfBuilders,
      minimumNumberOfHarvesters,
      minimumNumberOfRepairers,
      minimumNumberOfUpgraders,
      minimumNumberOfWallRepairers,
    } = spawn.memory.config;

    if (numberOfHarvesters < minimumNumberOfHarvesters) {
      name = spawn.createCustomCreep(energy, 'harvester');
      if (name === ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters === 0) {
        name = spawn.createCustomCreep(spawn.room.energyAvailable, 'harvester');
      }
    } else if (spawn.memory.claimRoom) {
      name = spawn.createClaimer(spawn.memory.claimRoom);
      if (!(name < 0)) {
        delete spawn.memory.claimRoom;
      }
    } else if (numberOfUpgraders < minimumNumberOfUpgraders) {
      name = spawn.createCustomCreep(energy, 'upgrader');
    } else if (numberOfRepairers < minimumNumberOfRepairers) {
      name = spawn.createCustomCreep(energy, 'repairer');
    } else if (numberOfBuilders < minimumNumberOfBuilders) {
      name = spawn.createCustomCreep(energy, 'builder');
    } else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
      name = spawn.createCustomCreep(energy, 'wallRepairer');
    } else {
      name = -1;
    }

    // TODO fix long distance harvesters
    // else if (numberOfLongDistanceHarvestersEast < minimumNumberOfLongDistanceHarvestersEast) {
    // name = spawn.createLongDistanceHarvester(energy, 5, home, 'E47S9', 0);
    // } else if (numberOfLongDistanceHarvestersNorth < minimumNumberOfLongDistanceHarvestersNorth) {
    // name = spawn.createLongDistanceHarvester(energy, 5, home, 'E46S8', 0);
    // }

    if (!(name < 0)) {
      console.log(`Spawned new ${Game.creeps[name].memory.role} creep: ${name}`);
      console.log(`Harvesters: ${numberOfHarvesters}`);
      console.log(`Upgraders: ${numberOfUpgraders}`);
      console.log(`Builders: ${numberOfBuilders}`);
      console.log(`Repairers: ${numberOfRepairers}`);
      console.log(`WallRepairers: ${numberOfWallRepairers}`);

      // TODO fix long distance harvesters
      // console.log(`LDH-E: ${numberOfLongDistanceHarvestersEast}`);
      // console.log(`LDH-North: ${numberOfLongDistanceHarvestersNorth}`);
    }
  });
};

module.exports = {
  loop,
};
