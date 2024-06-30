CREATE MIGRATION m1ehp3y5xnfb2kyrmolcw6nagoxzoig5xn7p3uaspxt42a3stvoyeq
    ONTO m1dlx5aupzzjwqus6dnsoh5b5yshn2m2l7gp7hhlm2wplrm2gbmuna
{
  CREATE TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity;
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  ALTER TYPE default::BlogPost {
      CREATE REQUIRED LINK author: default::User {
          SET REQUIRED USING (INSERT
              default::User
              {
                  name := 'Default User',
                  identity := std::assert_single(ext::auth::Identity)
              });
      };
  };
};
