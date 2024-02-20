package softeer.be33ma3.repository;

import softeer.be33ma3.domain.Post;

import java.util.List;

public interface PostCustomRepository {

    List<Post> findAllByConditions(Long memberId, Boolean done, List<String> regions, List<String> repairs, List<String> tuneUps, List<Long> postIds);
}
