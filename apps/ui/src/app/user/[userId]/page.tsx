

export default async function User({params}:{params:any}) {
    
    const userId = await params.userId;
    
    console.log(userId)
    return <>
        {userId}
    
    </>
}