import {BaseEntity} from "./BaseEntity";
import {Entity, OneToMany, OneToOne, Property} from "@mikro-orm/core";
import {FingerprintImage} from "./FingerprintImage";
import {Dermatoglyphics} from "./Dermatoglyphics";

type RelationWrapper<T> = T;

@Entity()
export class User extends BaseEntity {
    @Property({
        unique: true
    })
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

    @Property({
        nullable: true,
    })
    firstName!: string | null;

    @Property({
        nullable: true,
    })
    lastName!: string | null;

    @Property({
        nullable: true,
    })
    phone!: string | null;

    @Property({
        nullable: true,
    })
    bio!: string | null;

    @OneToMany(() => Dermatoglyphics, dermatoglyphics => dermatoglyphics.validator, {nullable: true})
    orderValidated!: RelationWrapper<Dermatoglyphics[]> | [];

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
            dermatoglyphics: this.dermatoglyphics,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone,
            bio: this.bio,
        } as any
    }
}