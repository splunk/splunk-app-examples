# ifeq ($(OS), Windows_NT)
# 	SEPERATOR=;
# else
# 	SEPERATOR=:
# endif
clean:
	mvn clean

package:
	mvn package

test:
	mvn test -fae

run:
	java -classpath './target/classes:./target/lib/*' com.splunk.examples.$(TARGET).Program $(ARGUMENTS)

test_specific:
	@sh ./scripts/test_specific.sh