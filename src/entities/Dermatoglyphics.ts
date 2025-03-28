import {Entity, Enum, ManyToOne, OneToOne, Property} from "@mikro-orm/core";
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

    @Property({type: 'double'})
    leftLitterFingerPercent!: number;

    @Property()
    leftLitterFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    leftRingFingerType!: DermatoglyphicsType;

    @Property({type: 'double'})
    leftRingFingerPercent!: number;

    @Property()
    leftRingFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    leftMiddleFingerType!: DermatoglyphicsType;

    @Property({type: 'double'})
    leftMiddleFingerPercent!: number;

    @Property()
    leftMiddleFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    leftIndexFingerType!: DermatoglyphicsType;

    @Property({type: 'double'})
    leftIndexFingerPercent!: number;

    @Property()
    leftIndexFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    leftThumbType!: DermatoglyphicsType;

    @Property({type: 'double'})
    leftThumbPercent!: number;

    @Property()
    leftThumbRank!: number;

    @Enum(() => DermatoglyphicsType)
    rightLitterFingerType!: DermatoglyphicsType;

    @Property({type: 'double'})
    rightLitterFingerPercent!: number;

    @Property()
    rightLitterFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    rightRingFingerType!: DermatoglyphicsType;

    @Property({type: 'double'})
    rightRingFingerPercent!: number;

    @Property()
    rightRingFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    rightMiddleFingerType!: DermatoglyphicsType;

    @Property({type: 'double'})
    rightMiddleFingerPercent!: number;

    @Property()
    rightMiddleFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    rightIndexFingerType!: DermatoglyphicsType;

    @Property({type: 'double'})
    rightIndexFingerPercent!: number;

    @Property()
    rightIndexFingerRank!: number;

    @Enum(() => DermatoglyphicsType)
    rightThumbType!: DermatoglyphicsType;

    @Property({type: 'double'})
    rightThumbPercent!: number;

    @Property()
    rightThumbRank!: number;

    @Property({type: 'double'})
    prefrontalLobePercent!: number;

    @Property({type: 'double'})
    frontalLobePercent!: number;

    @Property({type: 'double'})
    parietalLobePercent!: number;

    @Property({type: 'double'})
    occipitalLobePercent!: number;

    @Property({type: 'double'})
    temporalLobePercent!: number;

    @Property({type: 'double'})
    happinessIndex!: number;

    @Property({type: 'double'})
    hearingIndex!: number;

    @Property({type: 'double'})
    movementIndex!: number;

    @Property({type: 'double'})
    visualIndex!: number;

    @Property({type: 'char'})
    overview!: string;

    @Property({type: 'char'})
    brainLobes!: string

    @Property({type: 'char'})
    vak!: string;

    @Property({type: 'char'})
    happiness!: string;

    @ManyToOne(() => User)
    validator!: RelationWrapper<User>;

    @OneToOne(() => User, user => user.dermatoglyphics, {mappedBy: 'dermatoglyphics', orphanRemoval: true})
    user!: RelationWrapper<User>;
}