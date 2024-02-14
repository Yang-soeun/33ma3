package softeer.be33ma3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import softeer.be33ma3.domain.Post;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByDoneFalse();
}
