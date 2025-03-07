import {BaseEntity} from "./BaseEntity";
import {Entity, OneToOne, Property} from "@mikro-orm/core";
import {FingerprintImage} from "./FingerprintImage";
import {Dermatoglyphics} from "./Dermatoglyphics";

type RelationWrapper<T> = T;

@Entity()
export class User extends BaseEntity {
    @Property()
    username!: string;

    @Property({
        unique: true
    })
    email!: string;

    @Property()
    password!: string;

    @Property({
        default: 'user'
    })
    role!: string;

    @OneToOne(() => FingerprintImage, fingerprintImage => fingerprintImage.user, {owner: true, nullable: true})
    fingerprintImage!: RelationWrapper<FingerprintImage> | null;

    @OneToOne(() => Dermatoglyphics, dermatoglyphics => dermatoglyphics.user, {owner: true, nullable: true})
    dermatoglyphics!: RelationWrapper<Dermatoglyphics> | null;

    miniUser() {
        return {
            id: this.id,
            username: this.username,
            role: this.role,
            email: this.email,
            fingerprintImage: this.fingerprintImage,
            dermatoglyphics: this.dermatoglyphics
        }
    }
}