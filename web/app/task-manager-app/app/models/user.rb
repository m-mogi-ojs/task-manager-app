class User < ApplicationRecord
  has_many :kanbans
  before_save :downcase_email
  validates :email, presence: true
  validates :password, presence: true, length: { minimum: 6 }
  
  has_secure_password

  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?
    BCrypt::Password.new(digest).is_password?(token)
  end

  def forget
   update_attribute(:remember_digest, nil)
  end

  private 
  
    def downcase_email
      self.email.downcase!
    end
end
