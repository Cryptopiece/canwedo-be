import {Entity, Enum, OneToOne, Property} from "@mikro-orm/core";
import {BaseEntity} from "./BaseEntity";
import {User} from "./User";

type RelationWrapper<T> = T;

export enum DermatoglyphicsType {
    UL = 'UL',
    RL = 'RL',
    WT = 'WT',
    WS = 'WS',
    WE = 'WE',
    WC = 'WC',
    WD = 'WD',
    WI = 'WI',
    WP = 'WP',
    WL = 'WL',
    WX = 'WX',
    AS = 'AS',
    AT = 'AT',
    AU = 'AU',
    AR = 'AR',
}

@Entity()
export class Dermatoglyphics extends BaseEntity {
    constructor() {
        super();
    }

    @Enum(() => DermatoglyphicsType)
    leftLitterFingerType!: DermatoglyphicsType;

    @Enum(() => DermatoglyphicsType)
    leftRingFingerType!: DermatoglyphicsType;

    @Enum(() => DermatoglyphicsType)
    leftMiddleFingerType!: DermatoglyphicsType;

    @Enum(() => DermatoglyphicsType)
    leftIndexFingerType!: DermatoglyphicsType;

    @Enum(() => DermatoglyphicsType)
    leftThumbType!: DermatoglyphicsType;

    @Enum(() => DermatoglyphicsType)
    rightLitterFingerType!: DermatoglyphicsType;

    @Enum(() => DermatoglyphicsType)
    rightRingFingerType!: DermatoglyphicsType;

    @Enum(() => DermatoglyphicsType)
    rightMiddleFingerType!: DermatoglyphicsType;

    @Enum(() => DermatoglyphicsType)
    rightIndexFingerType!: DermatoglyphicsType;

    @Enum(() => DermatoglyphicsType)
    rightThumbType!: DermatoglyphicsType;

    @Property()
    prefrontalLobePercent!: number;

    @Property()
    frontalLobePercent!: number;

    @Property()
    parietalLobePercent!: number;

    @Property()
    occipitalLobePercent!: number;

    @Property()
    temporalLobePercent!: number;

    @Property()
    happinessIndex!: number;

    @Property()
    hearingIndex!: number;

    @Property()
    movementIndex!: number;

    @Property()
    visualIndex!: number;

    @OneToOne(() => User, user => user.dermatoglyphics, {mappedBy: 'dermatoglyphics', orphanRemoval: true})
    user!: RelationWrapper<User>;
}