import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  
  const tutorial1Content = {
    slug: 'lennard-jones-fluid',
    title: 'Tutorial 1: Lennard-Jones Fluid',
    content: `
# Tutorial 1: Lennard-Jones Fluid

This tutorial provides a step-by-step guide to simulating a Lennard-Jones (LJ) fluid using LAMMPS.

## 1. Introduction

The Lennard-Jones potential is a simple model that describes the interaction between a pair of neutral atoms or molecules.

### 1.1. The Potential

The LJ potential $V_{LJ}$ is given by the formula:

$$ V_{LJ}(r) = 4\\epsilon \\left[ \\left( \\frac{\\sigma}{r} \\right)^{12} - \\left( \\frac{\\sigma}{r} \\right)^6 \\right] $$

## 2. LAMMPS Input Script

Here is the complete input script for the simulation.

\`\`\`lammps
# Sample LAMMPS input script
variable x equal 10
print "Hello from LAMMPS"
\`\`\`

> **Note**
> This is a note box.

This is a list:
- Item 1
- Item 2
- Item 3

And some \`inline code\`.
      `,
    order: 1,
  };
  
  const tutorial1 = await prisma.tutorial.upsert({
    where: { slug: 'lennard-jones-fluid' },
    update: tutorial1Content,
    create: tutorial1Content,
  });

  console.log(`Seeding finished.`);
  console.log({ tutorial1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 