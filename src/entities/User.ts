import {BaseEntity} from "./BaseEntity";
import {Entity, OneToOne, Property} from "@mikro-orm/core";
import {FingerprintImage} from "./FingerprintImage";
import {Dermatoglyphics} from "./Dermatoglyphics";

type RelationWrapper<T> = T;

@Entity()
export class User extends BaseEntity {
    constructor() {
        super();
    }

    @Property()
    username!: string;

    @Property({
        unique: true
    })
    email!: string;

    @Property()
    password!: string;

    @Property()
    role!: string;

    @OneToOne(() => FingerprintImage, fingerprintImage => fingerprintImage.user, {owner: true})
    fingerprintImage!: RelationWrapper<FingerprintImage>;

    @OneToOne(() => Dermatoglyphics, dermatoglyphics => dermatoglyphics.user, {owner: true})
    dermatoglyphics!: RelationWrapper<Dermatoglyphics>;

    miniUser() {
        return {
            id: this.id,
            username: this.username,
            role: this.role,
            email: this.email,
        }
    }
}