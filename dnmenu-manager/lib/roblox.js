async function getRobloxUserInfo(username) {
    try {
        const userIdResponse = await fetch(`https://users.roblox.com/v1/usernames/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
        });
        const { data } = await userIdResponse.json();
        if (!data || data.length === 0) return null;

        const userId = data[0].id;

        const userInfoResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`);
        const userInfo = await userInfoResponse.json();

        const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`);
        const { data: avatarData } = await avatarResponse.json();

        return {
            id: userId,
            displayName: userInfo.displayName,
            created: userInfo.created,
            avatarUrl: avatarData[0].imageUrl,
            // Adicione mais dados se necessário
        };
    } catch (error) {
        console.error('Erro na API Roblox:', error);
        return null;
    }
}

module.exports = { getRobloxUserInfo };