import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { createProfile, queryState } from "./contracts/contracts_tx";
import { State, User } from "./type/struct_type";
import "./styles/App.css";

function App() {
  const [name, setName] = useState(""); // 用户名
  const [description, setDescription] = useState(""); // 用户简介
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [state, setState] = useState<State | null>(null); // 全局状态
  const [profiles, setProfiles] = useState<User[]>([]); // 所有用户资料列表
  const [currentProfile, setCurrentProfile] = useState<User | null>(null); // 当前账户的 Profile
  const currentUser = useCurrentAccount(); // 当前用户账户

  // 获取 Sui 链上的状态
  useEffect(() => {
    const fetchState = async () => {
      try {
        const state = await queryState();
        setState(state);
        setProfiles(state.users); // 保存所有用户资料

        // 检查当前账户是否有 Profile
        if (currentUser) {
          const userProfile = state.users.find((user) => user.owner === currentUser.address);
          setCurrentProfile(userProfile || null);
        }
      } catch (err) {
        console.error("Failed to fetch state:", err);
      }
    };
    fetchState();
  }, [state, currentUser]);

  // 创建 Profile
  const handleCreateProfile = async () => {
    if (!currentUser) {
      console.log("User not connected");
      return;
    }
    try {
      const tx = await createProfile(name, description);
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            console.log("Profile created");
            setName("");
            setDescription("");
            setCurrentProfile({ owner: currentUser.address, profile: "new_profile_id", name });
          },
          onError: (error) => {
            console.error("Failed to create profile:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error executing transaction:", error);
    }
  };

  // ProfileCard 组件
  const ProfileCard = ({ owner, profile }: { owner: string; profile: string }) => {
    const profileLink = `https://suiscan.xyz/testnet/object/${profile}`;
    return (
      <div className="profile-card">
        <div className="owner">
          <span>Owner: </span>
          {owner}
        </div>
        <div className="profile">
          <span>Profile: </span>
          <a href={profileLink} target="_blank" rel="noopener noreferrer">
            {profile}
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 页面标题 */}
      <div className="dapp-title-wrapper">
        <span className="text-2xl">Manage</span>
      </div>

      {/* 连接钱包按钮 */}
      <div className="connect-btn-wrapper">
        <ConnectButton />
      </div>

      <main className="container">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-6">


            {/* 根据当前账户是否有 Profile 显示不同的界面 */}
            {currentProfile ? (
              <>
                <div className="space-y-2 text-center">
                  <h1 className="heading">Profile List</h1>
                </div>
                <h2>Your Profile</h2>
                <ProfileCard owner={currentProfile.owner} profile={currentProfile.profile} />
                <h2>All Profiles</h2>
                <div className="profiles-list">
                  {profiles.map((user, index) => (
                    <ProfileCard key={index} owner={user.owner} profile={user.profile} />
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <h1 className="heading">Create Profile</h1>
                <div className="space-y-2">
                  <label htmlFor="name" className="label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="label">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input"
                  />
                </div>

                <button onClick={handleCreateProfile} className="button">
                  Create Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
