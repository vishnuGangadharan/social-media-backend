import mongoose ,{Schema,Model, Document} from "mongoose";
import { PostTypes } from "../../domain/post";

const PostSchema : Schema = new Schema<PostTypes>({
    content:{
        type: String
    },
    image :{
        type: [String],
        default: []
    },
    video :{
        type: [String],
        default: []
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    like: [{
        type: Schema.Types.ObjectId,
        ref:'User',
    }]
},{timestamps:true})

const PostModel : Model<PostTypes & Document > = mongoose.model< PostTypes & Document >('Post', PostSchema);
export default PostModel;