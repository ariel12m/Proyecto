"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventService = class EventService {
    eventService;
    constructor(eventService) {
        this.eventService = eventService;
    }
    create(createEventDto, userId) {
        return this.eventService.event.create({
            data: { ...createEventDto, userId }
        });
    }
    findAll() {
        return this.eventService.event.findMany();
    }
    findOne(id) {
        return this.eventService.event.findUnique({
            where: { id }
        });
    }
    update(id, updateEventDto) {
        return this.eventService.event.update({
            where: { id },
            data: { ...updateEventDto }
        });
    }
    remove(id) {
        return this.eventService.event.delete({
            where: { id }
        });
    }
    async createFromESP32(eventDto, sensorData) {
        try {
            const event = await this.eventService.event.create({
                data: {
                    title: eventDto.title,
                    description: eventDto.description,
                    sensorData: sensorData,
                    userId: 1,
                },
            });
            return { success: true, id: event.id };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventService);
//# sourceMappingURL=event.service.js.map