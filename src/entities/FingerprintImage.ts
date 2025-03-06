import {BaseEntity} from "./BaseEntity";
import {Entity, OneToOne, Property} from "@mikro-orm/core";
import {User} from "./User";

type RelationWrapper<T> = T;

@Entity()
export class FingerprintImage extends BaseEntity {
    constructor() {
        super();
    }

    @Property()
    leftLitterFinger!: string;

    @Property()
    leftRingFinger!: string;

    @Property()
    leftMiddleFinger!: string;

    @Property()
    leftIndexFinger!: string;

    @Property()
    leftThumb!: string;

    @Property()
    rightLitterFinger!: string;

    @Property()
    rightRingFinger!: string;

    @Property()
    rightMiddleFinger!: string;

    @Property()
    rightIndexFinger!: string;

    @Property()
    rightThumb!: string;

    @Property({
        nullable: true,
    })
    result!: string;

    @OneToOne(() => User, user => user.fingerprintImage, {mappedBy: 'fingerprintImage', orphanRemoval: true})
    user!: RelationWrapper<User>;
}