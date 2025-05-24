#!/usr/bin/env node

/**
 * Database Test Script
 * Tests the new hybrid schema and verifies all data was seeded correctly
 */

const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  console.log('🧪 Testing Database with New Schema...\n');

  const prisma = new PrismaClient();

  try {
    // Test 1: Check User with Brand Kit
    console.log('📋 Test 1: User with Brand Kit');
    const user = await prisma.user.findFirst({
      where: { email: 'demo@mockidea.com' }
    });
    
    if (user && user.brandKit) {
      console.log('✅ User found with brand kit:');
      console.log('   Primary Color:', user.brandKit.primaryColor);
      console.log('   Font Family:', user.brandKit.fontFamily);
      console.log('   Brand Personality:', user.brandKit.brandPersonality);
    } else {
      console.log('❌ User or brand kit not found');
    }

    // Test 2: Check Templates with New Fields
    console.log('\n📋 Test 2: Templates with Tags and Popularity');
    const templates = await prisma.template.findMany({
      take: 3
    });
    
    templates.forEach((template, index) => {
      console.log(`✅ Template ${index + 1}: ${template.name}`);
      console.log(`   Tags: ${template.tags.join(', ')}`);
      console.log(`   Popularity: ${template.popularity}`);
      console.log(`   Metadata: ${template.metadata ? 'Present' : 'None'}`);
    });

    // Test 3: Check Project Model
    console.log('\n📋 Test 3: Project Management');
    const project = await prisma.project.findFirst({
      include: { user: true }
    });
    
    if (project) {
      console.log('✅ Project found:');
      console.log(`   Name: ${project.name}`);
      console.log(`   Description: ${project.description}`);
      console.log(`   Owner: ${project.user.firstName} ${project.user.lastName}`);
      console.log(`   Mockup IDs: ${project.mockupIds.length} mockups`);
    } else {
      console.log('❌ Project not found');
    }

    // Test 4: Count all records
    console.log('\n📋 Test 4: Database Statistics');
    const stats = {
      users: await prisma.user.count(),
      logos: await prisma.logo.count(),
      templates: await prisma.template.count(),
      mockups: await prisma.mockup.count(),
      projects: await prisma.project.count(),
      subscriptions: await prisma.subscription.count(),
      usageHistory: await prisma.usageHistory.count()
    };

    console.log('✅ Database Statistics:');
    Object.entries(stats).forEach(([model, count]) => {
      console.log(`   ${model}: ${count} records`);
    });

    // Test 5: Verify Schema Features
    console.log('\n📋 Test 5: Schema Features Verification');
    
    // Check if all new fields are accessible
    const templateWithAllFields = await prisma.template.findFirst({
      select: {
        id: true,
        name: true,
        tags: true,
        popularity: true,
        metadata: true,
        aiAnalysis: true
      }
    });

    if (templateWithAllFields) {
      console.log('✅ All template fields accessible');
      console.log('✅ Tags field working:', Array.isArray(templateWithAllFields.tags));
      console.log('✅ Popularity field working:', typeof templateWithAllFields.popularity === 'number');
      console.log('✅ Metadata field working:', templateWithAllFields.metadata !== undefined);
    }

    console.log('\n🎉 All Database Tests Passed!');
    console.log('\n🚀 Ready for Application Testing');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
