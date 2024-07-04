import { Module } from '@nestjs/common';

import { BrevoService } from '@email/brevo.service';

@Module({
    imports: [
    ],
    exports: [
        BrevoService,
    ],
    providers: [
        BrevoService,
    ],
})
export class EmailModule {}
