module.exports = () => {
  StructureSpawn.prototype.createCustomCreep = function createCustomCreep(energy, roleName) {
    const numberOfParts = Math.floor(energy / 200);
    const body = [];
    for (let i = 0; i < numberOfParts; i += 1) {
      body.push(WORK);
    }
    for (let i = 0; i < numberOfParts; i += 1) {
      body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i += 1) {
      body.push(MOVE);
    }

    return this.createCreep(body, undefined, { role: roleName, working: false });
  };

  StructureSpawn.prototype.createLongDistanceHarvester = function createLongDistanceHarvester(
    energy,
    numberOfWorkParts,
    home,
    target,
    sourceIndex,
  ) {
    const body = [];
    for (let i = 0; i < numberOfWorkParts; i += 1) {
      body.push(WORK);
    }
    energy -= 150 * numberOfWorkParts;
    const numberOfParts = Math.floor(energy / 100);
    for (let i = 0; i < numberOfParts; i += 1) {
      body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts + numberOfWorkParts; i += 1) {
      body.push(MOVE);
    }

    return this.createCreep(body, undefined, {
      role: 'longDistanceHarvester',
      working: false,
      home,
      target,
      sourceIndex,
    });
  };

  StructureSpawn.prototype.createClaimer = function createClaimer(target) {
    return this.createCreep([CLAIM, MOVE], undefined, { role: 'claimer', target });
  };

  StructureSpawn.prototype.configureSpawn = function configureSpawn(config) {
    this.memory.config = {
      ...this.memory.config,
      ...config,
    };
  };
};
