async function listAllUsers() {
  try {
    const result = await client.users.list();
    if (result.ok) {
      console.log("Users:", result.members);
      return result.members;
    } else {
      console.error("Error fetching users:", result.error);
      return [];
    }
  } catch (error) {
    console.error("Network or API error:", error);
  }
}

export {listAllUsers}