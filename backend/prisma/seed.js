"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    const hashedPassword = await bcryptjs_1.default.hash('demo123', 12);
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@mockidea.com' },
        update: {},
        create: {
            email: 'demo@mockidea.com',
            password: hashedPassword,
            firstName: 'Demo',
            lastName: 'User',
            subscriptionTier: 'PRO',
            creditsRemaining: 50,
            emailVerified: true,
            brandKit: {
                primaryColor: '#3B82F6',
                secondaryColor: '#1E40AF',
                fontFamily: 'Inter',
                logoStyle: 'modern',
                brandPersonality: ['professional', 'innovative', 'trustworthy'],
                preferredCategories: ['business', 'digital', 'modern']
            },
        },
    });
    console.log('✅ Created demo user:', demoUser.email);
    const templates = [
        {
            name: 'Business Card Mockup',
            description: 'Professional business card presentation',
            category: 'business',
            tags: ['business', 'professional', 'cards', 'corporate'],
            popularity: 85,
            imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
            isPremium: false,
            aiAnalysis: {
                placement: {
                    preferredPosition: 'center',
                    scaleRange: [0.3, 0.7],
                    rotationTolerance: 10
                }
            },
            metadata: {
                dimensions: { width: 3.5, height: 2, unit: 'inches' },
                dpi: 300,
                colorMode: 'CMYK'
            }
        },
        {
            name: 'T-Shirt Mockup',
            description: 'Casual t-shirt logo placement',
            category: 'apparel',
            tags: ['apparel', 'casual', 'clothing', 'fashion'],
            popularity: 92,
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            isPremium: false,
            aiAnalysis: {
                placement: {
                    preferredPosition: 'center',
                    scaleRange: [0.2, 0.5],
                    rotationTolerance: 5
                }
            },
            metadata: {
                garmentType: 'crew-neck',
                material: 'cotton',
                sizes: ['S', 'M', 'L', 'XL']
            }
        },
        {
            name: 'Coffee Cup Mockup',
            description: 'Premium coffee cup branding',
            category: 'packaging',
            tags: ['packaging', 'coffee', 'beverage', 'premium'],
            popularity: 78,
            imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
            isPremium: true,
            aiAnalysis: {
                placement: {
                    preferredPosition: 'center',
                    scaleRange: [0.25, 0.6],
                    rotationTolerance: 15
                }
            },
            metadata: {
                cupSize: '12oz',
                material: 'paper',
                printArea: 'wrap-around'
            }
        },
        {
            name: 'Letterhead Mockup',
            description: 'Professional letterhead design',
            category: 'stationery',
            imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
            isPremium: false,
            aiAnalysis: {
                placement: {
                    preferredPosition: 'top-left',
                    scaleRange: [0.15, 0.4],
                    rotationTolerance: 0
                }
            }
        },
        {
            name: 'Website Mockup',
            description: 'Modern website header logo',
            category: 'digital',
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
            isPremium: true,
            aiAnalysis: {
                placement: {
                    preferredPosition: 'top-left',
                    scaleRange: [0.1, 0.3],
                    rotationTolerance: 0
                }
            }
        },
        {
            name: 'Storefront Sign',
            description: 'Outdoor storefront signage',
            category: 'signage',
            imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
            isPremium: true,
            aiAnalysis: {
                placement: {
                    preferredPosition: 'center',
                    scaleRange: [0.4, 0.8],
                    rotationTolerance: 5
                }
            }
        },
        {
            name: 'Hoodie Mockup',
            description: 'Comfortable hoodie with logo',
            category: 'apparel',
            imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
            isPremium: false,
            aiAnalysis: {
                placement: {
                    preferredPosition: 'center',
                    scaleRange: [0.2, 0.5],
                    rotationTolerance: 5
                }
            }
        },
        {
            name: 'Notebook Cover',
            description: 'Professional notebook branding',
            category: 'stationery',
            imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
            isPremium: false,
            aiAnalysis: {
                placement: {
                    preferredPosition: 'center',
                    scaleRange: [0.3, 0.7],
                    rotationTolerance: 10
                }
            }
        }
    ];
    for (const template of templates) {
        const existingTemplate = await prisma.template.findFirst({
            where: { name: template.name }
        });
        if (!existingTemplate) {
            await prisma.template.create({
                data: template,
            });
        }
    }
    console.log('✅ Created sample templates');
    const existingLogo = await prisma.logo.findFirst({
        where: {
            userId: demoUser.id,
            filename: 'sample-logo.png'
        }
    });
    if (!existingLogo) {
        const sampleLogo = await prisma.logo.create({
            data: {
                userId: demoUser.id,
                filename: 'sample-logo.png',
                originalUrl: 'https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=LOGO',
                thumbnailUrl: 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=LOGO',
                fileSize: 15000,
                mimeType: 'image/png',
                aiAnalysis: {
                    style: 'modern',
                    complexity: 2,
                    hasText: true,
                    recommendedCategories: ['business', 'digital', 'modern'],
                    dominantColors: ['#3B82F6', '#FFFFFF'],
                    colors: [
                        { name: 'Blue', hex: '#3B82F6', rgb: [59, 130, 246], population: 60 },
                        { name: 'White', hex: '#FFFFFF', rgb: [255, 255, 255], population: 40 }
                    ],
                    placement: {
                        preferredPosition: 'center',
                        scaleRange: [0.2, 0.8],
                        rotationTolerance: 15
                    }
                }
            }
        });
        console.log('✅ Created sample logo');
    }
    else {
        console.log('✅ Sample logo already exists');
    }
    const existingProject = await prisma.project.findFirst({
        where: {
            userId: demoUser.id,
            name: 'Brand Identity Package'
        }
    });
    if (!existingProject) {
        const sampleProject = await prisma.project.create({
            data: {
                userId: demoUser.id,
                name: 'Brand Identity Package',
                description: 'Complete brand identity mockups for client presentation',
                mockupIds: [],
                isPublic: false
            }
        });
        console.log('✅ Created sample project');
    }
    else {
        console.log('✅ Sample project already exists');
    }
    console.log('🎉 Database seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map