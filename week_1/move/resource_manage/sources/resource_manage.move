module resource_manage::resource_manage{
    use std::string::{String};
    use sui::table::{Self, Table};
    use sui::event;

    const VERSION: u64 = 1;
    const EProfileExit: u64 = 0;
    const EWrongVersion: u64 = 1;

    public struct AdminCap has key {
        id: UID,
    }
    

    public struct State has key {
        id: UID,
        users: Table<address, address>,
        admin: ID,
        version: u64,
    }

    public struct Profile has key {
        id: UID,
        name: String,
        description: String,
        version: u64,
    }

    public struct ProfileCreated has copy, drop {
        profile: address,
        owner: address,
    }

    fun init(ctx: &mut TxContext) {
        let admin = AdminCap {
            id: object::new(ctx),
        };
        transfer::share_object(State{
            id: object::new(ctx), 
            users: table::new(ctx),
            admin: object::id(&admin),
            version: VERSION,
        });
        transfer::transfer(admin, tx_context::sender(ctx));
    }

    public entry fun create_profile(name: String, description: String, state: &mut State, ctx: &mut TxContext) {
        // 判断State的版本
        assert!(state.version == VERSION, EWrongVersion);
        let owner = tx_context::sender(ctx);
        assert!(!table::contains(&state.users, owner), EProfileExit);
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);

        let new_profile = Profile {
            id: uid,
            name: name,
            description: description,
            version: VERSION,
        };

        transfer::transfer(new_profile, owner);
        table::add(&mut state.users, owner, object::id_to_address(&id));

        event::emit(ProfileCreated { 
            profile: object::id_to_address(&id), 
            owner,
        });
    }

    public fun check_has_profile(state: &State, user: address): Option<address> {
        // 判断State的版本
        assert!(state.version == VERSION, EWrongVersion);
        if(table::contains(&state.users, user)) {
            option::some(*table::borrow(&state.users, user))
        }else {
            option::none()
        }
    }
}



