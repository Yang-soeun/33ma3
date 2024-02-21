package softeer.be33ma3.repository.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import softeer.be33ma3.domain.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByPost_PostId(Long postId);

    @Query("SELECT AVG(r.score) FROM Review r WHERE r.center.memberId = :memberId")
    Optional<Double> findAvgScoreByCenterId(Long memberId);
    List<Review> findByCenter_MemberId(Long memberId);
}
