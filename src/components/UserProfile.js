const UserProfile = () => {
  return(
    <>
    
    <table className="w-[100%]">
    <thead className="bg-sky-200 w-[100%]">
      <tr className="">
        <th className="font-normal">Project Name</th>
        <th className="font-normal">Read</th>
        <th className="font-normal">Update</th>
        <th className="font-normal">Delete</th>
      </tr>
    </thead>
    <tbody className="w-[100%] flex justify-evenly">
      <tr>
        <td className="">UCC</td>
        <td className=""><input type="checkbox"/></td>
        <td className=""><input type="checkbox"/></td>
        <td className=""><input type="checkbox"/></td>

      </tr>
    </tbody>
  </table>
    </>
  )
}

export default UserProfile
