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
    AL = 'AL',
}

@Entity()
export class Dermatoglyphics extends BaseEntity {
    @Enum(() => DermatoglyphicsType)
    leftLitterFingerType!: DermatoglyphicsType;

    @Property()
    leftLitterFingerPercent!: number;

    @Property()
    leftLitterFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    leftRingFingerType!: DermatoglyphicsType;

    @Property()
    leftRingFingerPercent!: number;

    @Property()
    leftRingFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    leftMiddleFingerType!: DermatoglyphicsType;

    @Property()
    leftMiddleFingerPercent!: number;

    @Property()
    leftMiddleFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    leftIndexFingerType!: DermatoglyphicsType;

    @Property()
    leftIndexFingerPercent!: number;

    @Property()
    leftIndexFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    leftThumbType!: DermatoglyphicsType;

    @Property()
    leftThumbPercent!: number;

    @Property()
    leftThumbRank!: number;

    @Enum(() => DermatoglyphicsType)
    rightLitterFingerType!: DermatoglyphicsType;

    @Property()
    rightLitterFingerPercent!: number;

    @Property()
    rightLitterFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    rightRingFingerType!: DermatoglyphicsType;

    @Property()
    rightRingFingerPercent!: number;

    @Property()
    rightRingFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    rightMiddleFingerType!: DermatoglyphicsType;

    @Property()
    rightMiddleFingerPercent!: number;

    @Property()
    rightMiddleFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    rightIndexFingerType!: DermatoglyphicsType;

    @Property()
    rightIndexFingerPercent!: number;

    @Property()
    rightIndexFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    rightThumbType!: DermatoglyphicsType;

    @Property()
    rightThumbPercent!: number;

    @Property()
    rightThumbRank!: number;

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